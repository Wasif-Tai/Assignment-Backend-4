import { Idea } from "../models/Idea.js";

// Require an existing user context and allow only the specified authorization roles.
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }

  next();
};

// Allow an admin or the owner of the idea identified by the route's `ideaId` parameter.
export const requireIdeaOwnerOrAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role === "admin") {
    return next();
  }

  const idea = await Idea.findById(req.params.ideaId).select("founderId");

  if (!idea) {
    return res.status(404).json({ message: "Idea not found" });
  }

  if (idea.founderId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }

  next();
};
