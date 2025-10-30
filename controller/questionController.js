const { StatusCodes } = require("http-status-codes");
const dbConnection = require("../config/dbConfig");

// POST QUESTION
async function postQuestion(req, res) {
  const { userid, title, description } = req.body;

  if (!userid || !title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "All fields are required" });
  }

  // Timestamp UTC+3
  const currentTimestamp = new Date();
  const adjustedDate = new Date(
    currentTimestamp.getTime() + 3 * 60 * 60 * 1000
  );
  const formattedTimestamp = adjustedDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  try {
    // Insert into DB without questionid (MySQL handles AUTO_INCREMENT)
    const [result] = await dbConnection.query(
      "INSERT INTO questions (userid, title, description, createdAt) VALUES (?, ?, ?, ?)",
      [userid, title, description, formattedTimestamp]
    );

    const questionid = result.insertId; // Get auto-generated ID

    console.log("Post question:", title); // now you will see this log
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Question posted successfully", questionid });
  } catch (err) {
    console.error("Error posting question:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// GET ALL QUESTIONS
async function getAllQuestions(req, res) {
  try {
    const [questions] = await dbConnection.query(`
      SELECT q.questionid, q.title, q.description, q.createdAt, u.username
      FROM questions q
      INNER JOIN users u ON q.userid = u.userid
      ORDER BY q.createdAt DESC
    `);
    return res.status(StatusCodes.OK).json({ message: questions });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong, please try again later" });
  }
}

// GET SINGLE QUESTION + ANSWERS
async function getQuestionAndAnswer(req, res) {
  const questionid = req.params.questionId;

  try {
    const [rows] = await dbConnection.query(
      `SELECT 
          q.questionid, 
          q.title, 
          q.description, 
          q.createdAt AS question_createdAt,
          u2.username as question_username,
          a.answerid, 
          a.userid AS answer_userid, 
          a.answer,
          a.createdAt,
          u.username as answer_username
       FROM questions q
       LEFT JOIN answers a ON q.questionid = a.questionid
       LEFT JOIN users u on u.userid = a.userid
       LEFT JOIN users u2 on u2.userid = q.userid
       WHERE q.questionid = ?
       ORDER BY a.createdAt DESC`,
      [questionid]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Question not found" });
    }

    const questionDetails = {
      id: rows[0].questionid,
      title: rows[0].title,
      description: rows[0].description,
      qtn_createdAt: rows[0].question_createdAt,
      qtn_username: rows[0].question_username,
      answers: rows
        .map((answer) => ({
          answerid: answer.answerid,
          userid: answer.answer_userid,
          username: answer.answer_username,
          answer: answer.answer,
          createdAt: answer.createdAt,
        }))
        .filter((answer) => answer.answerid !== null),
    };

    return res.status(StatusCodes.OK).json(questionDetails);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Error fetching question details" });
  }
}

module.exports = { postQuestion, getAllQuestions, getQuestionAndAnswer };
