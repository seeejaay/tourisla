const {
  createRule,
  editRule,
  deleteRule,
  getAllRules,
  getRuleById,
} = require("../models/rulesRegulationModel.js");

// Create Rule Controller
const createRuleController = async (req, res) => {
  try {
    const {
      title,
      description,
      penalty,
      category,
      is_active,
      effective_date
    } = req.body;

    const rule = await createRule({
      title: title?.toUpperCase(),
      description: description?.toUpperCase(),
      penalty: penalty?.toUpperCase(),
      category: category?.toUpperCase(),
      is_active,
      effective_date
    });

    res.json(rule);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

// Edit Rule Controller
const editRuleController = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const {
      title,
      description,
      penalty,
      category,
      is_active,
      effective_date
    } = req.body;

    const rule = await editRule(ruleId, {
      title: title?.toUpperCase(),
      description: description?.toUpperCase(),
      penalty: penalty?.toUpperCase(),
      category: category?.toUpperCase(),
      is_active,
      effective_date
    });

    res.json(rule);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

// Delete Rule Controller
const deleteRuleController = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const rule = await deleteRule(ruleId);
    res.json(rule);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

// View All Rules
const viewRulesController = async (req, res) => {
  try {
    const rules = await getAllRules();
    res.json(rules);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

// View Rule by ID
const viewRuleByIdController = async (req, res) => {
  try {
    const { ruleId } = req.params;
    const rule = await getRuleById(ruleId);
    res.json(rule);
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  createRuleController,
  editRuleController,
  deleteRuleController,
  viewRulesController,
  viewRuleByIdController,
};
