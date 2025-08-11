import { Modal } from 'antd';
import React from 'react'
import type { IClassSchedule } from '../../../../../store/admin/classManagement';

interface FormScheduleModelProps {
  // Define any props if needed
  isOpen?: boolean;
  onClose?: () => void;
  selectedSchedule?: IClassSchedule;
}

const FormScheduleModal: React.FC<FormScheduleModelProps> = ({ isOpen, onClose, selectedSchedule }) => {
  return (
    <Modal
      title="Schedule"
      open={isOpen}
      onCancel={onClose}
      footer={null}
    >
      <div>FormScheduleModal</div>
    </Modal>
  )
}

export default FormScheduleModal