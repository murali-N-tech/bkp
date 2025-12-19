import Session from '../models/quizSessionModel.js';
import ExcelJS from 'exceljs';

/**
 * ======================================================
 * 1. Create or Store a Quiz Session
 * POST /api/quiz-session
 * Access: Student / Public
 * ======================================================
 */
export const createQuizSession = async (req, res) => {
  try {
    const { email, userId, domainId, sessionId, payload, attemptedAt } = req.body;

    if (!sessionId || !payload) {
      return res.status(400).json({
        status: 'error',
        message: 'sessionId and payload are required',
      });
    }

    const newSession = new Session({
      email: email || null,
      userId: userId || null, // optional (guest support)
      domainId,
      sessionId,
      payload,
      attemptedAt: attemptedAt ? new Date(attemptedAt) : new Date(),
    });

    const saved = await newSession.save();

    return res.status(201).json({
      status: 'success',
      data: saved,
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
 * ======================================================
 * 2. Get Assignment Performance (All Students)
 * GET /api/quiz-session/performance/:domainId
 * Access: Teacher
 * ======================================================
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

    const sessions = await Session.find({ domainId })
      .populate('userId', 'name email')
      .sort({ attemptedAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: sessions.length,
      data: sessions,
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
 * ======================================================
 * 3. Get Student History (Performance Trend)
 * GET /api/quiz-session/student/:studentId
 * Access: Student / Teacher
 * ======================================================
 */
export const getStudentHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        status: 'error',
        message: 'studentId is required',
      });
    }

    const sessions = await Session.find({ userId: studentId })
      .sort({ attemptedAt: 1 });

    const chartData = sessions.map((session) => ({
      date: new Date(session.attemptedAt).toLocaleDateString(),
      score: session.payload?.score ?? 0,
      status: session.payload?.status ?? 'Completed',
    }));

    return res.status(200).json({
      status: 'success',
      data: chartData,
    });
  } catch (error) {
    console.error('Get Student History Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * ======================================================
 * 4. Export Assignment Performance to Excel
 * GET /api/quiz-session/export/:domainId
 * Access: Teacher
 * ======================================================
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

    const results = await Session.find({ domainId })
      .populate('userId', 'name email');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Performance');

    worksheet.columns = [
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Student Email', key: 'email', width: 30 },
      { header: 'Score (%)', key: 'score', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Attempted At', key: 'date', width: 25 },
    ];

    results.forEach((session) => {
      worksheet.addRow({
        name: session.userId?.name || 'Guest',
        email: session.userId?.email || session.email || 'Anonymous',
        score: session.payload?.score ?? 0,
        status: session.payload?.status ?? 'Completed',
        date: session.attemptedAt
          ? session.attemptedAt.toLocaleString()
          : 'N/A',
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=Assignment_${domainId}_Performance.xlsx`
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
