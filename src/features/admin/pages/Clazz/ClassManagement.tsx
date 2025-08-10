
import ClassControlPanel from './components/ClassControlPanel'
import { useSearchParams  } from 'react-router-dom';

const ClassManagement = () => {
    // You can manage searchParams and setSearchParams here if needed
    const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div>
        <ClassControlPanel searchParams={searchParams} setSearchParams={setSearchParams} />
        <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
           Render class list or other content here 
        </div>
    </div>
  )
}

export default ClassManagement