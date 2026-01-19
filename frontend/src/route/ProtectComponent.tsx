import PropTypes from "prop-types";
import useStaffAuthStore from "../providers/useStaffAuthStore";

const ProtectComponent = ({ children, requiredPermission }) => {
  const { permission, role } = useStaffAuthStore();

  // Non-staff roles can access unconditionally
  if (role !== "staff") {
    return children;
  }

  // Check if the required permission exists
  if (!requiredPermission || permission.includes(requiredPermission)) {
    return children;
  }

  // Block access by default
  return null;
};

ProtectComponent.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.string,
};

export default ProtectComponent;
