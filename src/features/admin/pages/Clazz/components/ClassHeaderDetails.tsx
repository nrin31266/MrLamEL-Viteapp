import React, { useState } from 'react';
import { useAppSelector } from '../../../../../store/store';
import { Button, Tooltip } from 'antd';
import MarkClassOnReadyModal from './MarkClassOnReadyModal';

const ClassHeaderDetails = () => {
  const clazz = useAppSelector((state) => state.admin.classDetails.clazz);

  const isAllowReady = clazz?.status === 'DRAFT' && clazz?.schedules?.length > 0;
  const [isOpenMarkClassOnReady, setIsOpenMarkClassOnReady] = useState(false);
  // Mô tả tooltip khi chưa ready
  const tooltipText = !isAllowReady
    ? clazz?.status !== 'DRAFT'
      ? 'Class must be in Draft status to Ready'
      : 'At least one schedule is required'
    : '';

  return (
    <header className='sticky top-0 z-10 h-max bg-white p-2 shadow'>
      <div className='flex justify-end items-center'>
        <Tooltip title={tooltipText}>
          <Button onClick={() => setIsOpenMarkClassOnReady(true)} size='large' type="primary" disabled={!isAllowReady}>
            {isAllowReady ? "Ready" : "Not Ready"}
          </Button>
        </Tooltip>
      </div>
       <MarkClassOnReadyModal
        isOpen={isOpenMarkClassOnReady}
        onClose={() => setIsOpenMarkClassOnReady(false)}
      />
    </header>
  );
}

export default ClassHeaderDetails;
