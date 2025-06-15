const {
  createPolicy,
  editPolicy,
  deletePolicy,
  getAllPolicies,
  getPolicyById,
  getPoliciesByType,
} = require("../models/policyModel.js");

const createPolicyController = async (req, res) => {
  try {
    const { type, content, version, effective_date } = req.body;
    const userId = req.session.user?.user_id ?? req.session.user?.id;

    if (!type || !content || !version || !effective_date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const policy = await createPolicy({
      type,
      content,
      version,
      effective_date,
      created_by_user_id: userId,
    });

    res.status(201).json(policy);
  } catch (err) {
    console.error("Create Policy Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const editPolicyController = async (req, res) => {
  try {
    const { policyId } = req.params;
    const { type, content, version, effective_date } = req.body;

    if (!type || !content || !version || !effective_date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedPolicy = await editPolicy(policyId, {
      type,
      content,
      version,
      effective_date,
    });

    if (!updatedPolicy) {
      return res.status(404).json({ error: "Policy not found." });
    }

    res.json(updatedPolicy);
  } catch (err) {
    console.error("Edit Policy Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const deletePolicyController = async (req, res) => {
  try {
    const { policyId } = req.params;
    const deleted = await deletePolicy(policyId);

    if (!deleted) {
      return res.status(404).json({ error: "Policy not found." });
    }

    res.json(deleted);
  } catch (err) {
    console.error("Delete Policy Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getAllPoliciesController = async (req, res) => {
  try {
    const policies = await getAllPolicies();
    res.json(policies);
  } catch (err) {
    console.error("Get All Policies Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getPolicyByIdController = async (req, res) => {
  try {
    const { policyId } = req.params;
    const policy = await getPolicyById(policyId);

    if (!policy) {
      return res.status(404).json({ error: "Policy not found." });
    }

    res.json(policy);
  } catch (err) {
    console.error("Get Policy By ID Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getPoliciesByTypeController = async (req, res) => {
  try {
    const { type } = req.params;
    const policies = await getPoliciesByType(type);
    res.json(policies);
  } catch (err) {
    console.error("Get Policies By Type Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPolicyController,
  editPolicyController,
  deletePolicyController,
  getAllPoliciesController,
  getPolicyByIdController,
  getPoliciesByTypeController,
};
