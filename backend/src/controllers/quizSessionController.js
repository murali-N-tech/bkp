// bkp1/backend/src/controllers/quizSessionController.js

import Session from '../models/quizSessionModel.js';
import ExcelJS from 'exceljs'; // Ensure: npm install exceljs

/**
 * @desc    Create or store a quiz session
 * @route   POST /api/quiz-session
 * @access  Student / Public
 */
export const createQuizSession = async (req, res) => {
  try {
    const { email, domainId, sessionId, payload } = req.body;

    if (!sessionId || !payload) {
      return res.status(400).json({
        status: 'error',
        message: 'sessionId and payload are required',
      });
    }

    const newSession = new Session({
      email: email || null,
      domainId,
      sessionId,
      payload,
      attemptedAt: new Date(),
    });

    await newSession.save();

    return res.status(201).json({
      status: 'success',
      data: newSession,
    });
  } catch (error) {
    console.error('Create Quiz Session Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * @desc    Fetch individual performance for a teacher's assignment
 * @route   GET /api/quiz-session/performance/:domainId
 * @access  Teacher
 */
export const getAssignmentPerformance = async (req, res) => {
  try {
    const { domainId } = req.params;

    if (!domainId) {
      return res.status(400).json({
        status: 'error',
        message: 'domainId is required',
      });
    }

    const results = await Session.find({ domainId }).sort({
      attemptedAt: -1,
    });

    return res.status(200).json({
      status: 'success',
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Get Assignment Performance Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * @desc    Export assignment performance to Excel
 * @route   GET /api/quiz-session/export/:domainId
 * @access  Teacher
 */
export const exportAssignmentToExcel = async (req, res) => {
  try {
    const { domainId } = req.params;

    if (!domainId) {
      return res.status(400).json({
        status: 'error',
        message: 'domainId is required',
      });
    }

    const results = await Session.find({ domainId });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Performance');

    // Define Excel columns
    worksheet.columns = [
      { header: 'Student Email', key: 'email', width: 30 },
      { header: 'Score (%)', key: 'score', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Date Attempted', key: 'date', width: 25 },
    ];

    // Fill rows
    results.forEach((session) => {
      worksheet.addRow({
        email: session.email || 'Anonymous',
        score: session.payload?.score ?? 0,
        status: session.payload?.status ?? 'Completed',
        date: session.attemptedAt
          ? session.attemptedAt.toISOString()
          : 'N/A',
      });
    });

    // Send Excel file
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Performance_${domainId}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Excel Export Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Export failed',
    });
  }
};
