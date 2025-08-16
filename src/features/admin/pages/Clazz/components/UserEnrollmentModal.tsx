import { Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
interface UserEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const UserEnrollmentModal: React.FC<UserEnrollmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    const search = async () => {
      // Implement your search logic here
      console.log(`Searching for: ${searchTerm}`);
    };
    const delayDebounceFn = setTimeout(() => {
      search();
    }, 800); // 800ms delay for debouncing
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  return (
    <Modal
      title={<h1 className="text-2xl text-gray-800">User Enrollment</h1>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div>


        <Input
        placeholder="Enter email"
    
        size="large"
        className="!w-full"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        allowClear 
        type="text"
      />

      </div>
    </Modal>
  );
};

export default UserEnrollmentModal;
