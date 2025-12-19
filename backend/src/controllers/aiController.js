const { getGeminiModel } = require("../services/gemini");

// desc Get code suggestions
// route /api/ai/suggest
// access private
const getCodeSuggestions = async (req, res) => {
  try {
    const { code, language, context } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `You are a helpful coding assistant. Given the following ${
      language || "code"
    } code, provide a helpful suggestion or completion:
        Context: ${context || "No additional context"}
        
        Code:
        \`\`\`${language || "javascript"}
        ${code}
        
        Provide a concise suggestion or code completion. Only return the suggested code without explanations`;

    const response = await getGeminiModel(prompt);
    const suggestion = response.text;

    res.json({
      success: true,
      suggestion,
      language: language || "javascript",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate Suggestion",
      error: error.message,
    });
  }
};

// @desc    Review code with AI
// @route   POST /api/ai/review
// @access  Private
const reviewCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `You are an expert code reviewer. Review the following ${
      language || "code"
    } thoroughly:

Code:
\`\`\`${language || "javascript"}
${code}
\`\`\`

Provide a Short review covering:
1. **Bugs & Issues:** Any potential bugs or errors
2. **Code Quality:** Readability, maintainability, structure
3. **Best Practices:** Are coding standards followed?
4. **Performance:** Any performance concerns or optimizations
5. **Security:** Security vulnerabilities (if any)
6. **Suggestions:** Specific improvements to make
7. **Overall Rating:** Rate the code from 1-10

Be constructive and helpful in your feedback.`;

    const response = await getGeminiModel(prompt);
    const review = response.text;

    res.json({
      success: true,
      review,
      language: language || "javascript",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to review code",
      error: error.message,
    });
  }
};

// @desc    Explain code with AI
// @route   POST /api/ai/explain
// @access  Private
const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `Explain the following ${
      language || "code"
    } in simple terms. Break it down line by line if needed:

\`\`\`${language || "javascript"}
${code}
\`\`\`

Provide a clear, easy-to-understand explanation.`;

    const response = await getGeminiModel(prompt);
    const explain = response.text;
    res.json({
      success: true,
      explain,
      language: language || "javascript",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to explain code",
      error: error.message,
    });
  }
};

// @desc    Fix code with AI
// @route   POST /api/ai/fix
// @access  Private
const fixCode = async (req, res) => {
  try {
    const { code, language, issue } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const prompt = `Fix the following ${language || "code"}. ${
      issue ? `The issue is: ${issue}` : "Find and fix any bugs or issues."
    }

Original Code:
\`\`\`${language || "javascript"}
${code}
\`\`\`

Provide the fixed code and a brief explanation of what was wrong.`;

    const response = await getGeminiModel(prompt);
    const fixedCode = response.text;

    res.json({
      success: true,
      fixedCode,
      language: language || "javascript",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fix code",
      error: error.message,
    });
  }
};

module.exports = { getCodeSuggestions, reviewCode, explainCode, fixCode };
