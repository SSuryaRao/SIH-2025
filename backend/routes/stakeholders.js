import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { db, bucket } from '../firebase.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, PDFs, and documents
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'));
    }
  }
});

// Helper function to upload file to Firebase Storage
const uploadToFirebase = async (file, folder) => {
  const fileName = `${folder}/${uuidv4()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', async () => {
      try {
        // Make the file publicly accessible
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    stream.end(file.buffer);
  });
};

// POST /api/stakeholders/register - Register a new stakeholder
router.post('/register', upload.single('document'), async (req, res) => {
  try {
    const { name, role, organization, email, phone, expertise } = req.body;

    // Validate required fields
    if (!name || !role || !organization || !email || !phone || !expertise) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if stakeholder already exists
    const existingStakeholder = await db.collection('stakeholders').where('email', '==', email).get();
    if (!existingStakeholder.empty) {
      return res.status(409).json({
        success: false,
        message: 'Stakeholder with this email already exists'
      });
    }

    let documentUrl = null;

    // Upload document if provided
    if (req.file) {
      try {
        documentUrl = await uploadToFirebase(req.file, 'stakeholder-documents');
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload document'
        });
      }
    }

    // Create stakeholder document
    const stakeholderData = {
      name,
      role,
      organization,
      email,
      phone,
      expertise,
      documentUrl,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('stakeholders').add(stakeholderData);

    res.status(201).json({
      success: true,
      message: 'Stakeholder registered successfully',
      data: {
        id: docRef.id,
        ...stakeholderData
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// POST /api/stakeholders/content - Submit content
router.post('/content', upload.single('file'), async (req, res) => {
  try {
    const { title, contentType, details, stakeholderId } = req.body;

    // Validate required fields
    if (!title || !contentType || !details) {
      return res.status(400).json({
        success: false,
        message: 'Title, content type, and details are required'
      });
    }

    let fileUrl = null;

    // Upload file if provided
    if (req.file) {
      try {
        fileUrl = await uploadToFirebase(req.file, 'content-files');
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file'
        });
      }
    }

    // Create content document
    const contentData = {
      title,
      contentType,
      details,
      fileUrl,
      stakeholderId: stakeholderId || null,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('content-submissions').add(contentData);

    res.status(201).json({
      success: true,
      message: 'Content submitted successfully',
      data: {
        id: docRef.id,
        ...contentData
      }
    });

  } catch (error) {
    console.error('Content submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/stakeholders - Get all verified stakeholders
router.get('/', async (req, res) => {
  try {
    const { role, search, limit = 50 } = req.query;

    let query = db.collection('stakeholders').where('verified', '==', true);

    // Filter by role if provided
    if (role && role !== 'All') {
      query = query.where('role', '==', role);
    }

    // Limit results
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    const stakeholders = [];

    snapshot.forEach(doc => {
      const data = doc.data();

      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          data.name.toLowerCase().includes(searchLower) ||
          data.organization.toLowerCase().includes(searchLower) ||
          data.expertise.toLowerCase().includes(searchLower);

        if (matchesSearch) {
          stakeholders.push({
            id: doc.id,
            ...data
          });
        }
      } else {
        stakeholders.push({
          id: doc.id,
          ...data
        });
      }
    });

    res.json({
      success: true,
      data: stakeholders,
      total: stakeholders.length
    });

  } catch (error) {
    console.error('Get stakeholders error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/stakeholders/:id - Get stakeholder by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('stakeholders').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Stakeholder not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });

  } catch (error) {
    console.error('Get stakeholder error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/stakeholders/content/approved - Get approved content
router.get('/content/approved', async (req, res) => {
  try {
    const { contentType, limit = 20 } = req.query;

    let query = db.collection('content-submissions').where('status', '==', 'approved');

    if (contentType) {
      query = query.where('contentType', '==', contentType);
    }

    query = query.orderBy('createdAt', 'desc').limit(parseInt(limit));

    const snapshot = await query.get();
    const content = [];

    snapshot.forEach(doc => {
      content.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      data: content,
      total: content.length
    });

  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/stakeholders/:id/verify - Verify a stakeholder (admin only)
router.put('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { verified } = req.body;

    await db.collection('stakeholders').doc(id).update({
      verified: Boolean(verified),
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Stakeholder ${verified ? 'verified' : 'unverified'} successfully`
    });

  } catch (error) {
    console.error('Verify stakeholder error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
  }

  if (error.message === 'Invalid file type. Only images, PDFs, and documents are allowed.') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  console.error('Route error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default router;