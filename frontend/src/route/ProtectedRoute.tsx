import PropTypes from "prop-types";
import useStaffAuthStore from "../providers/useStaffAuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { permission, role } = useStaffAuthStore();
  const navigate = useNavigate();

  const hadRequiredPermissions = () => {
    if (!requiredPermission || requiredPermission.length === 0) return true;
    return requiredPermission.some((requiredPer) =>
      permission.includes(requiredPer)
    );
  };
  useEffect(() => {
    if (role === "staff" && !hadRequiredPermissions()) {
      navigate("/unauthorized");
    }
  }, [role, permission, requiredPermission, navigate]);

  if (role === "staff" && !hadRequiredPermissions()) {
    return null;
  }
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.arrayOf(PropTypes.string),
};

export default ProtectedRoute;
