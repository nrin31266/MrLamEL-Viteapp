import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store"
import { getSolarHolidays } from "../../../store/common/holidaysSlide";
import Loading from "../../../components/common/Loading";
import  dayjs  from 'dayjs';
//   {
//             "date": "2025-01-29",
//             "name": "Tết Nguyên Đán",
//             "year": 2025,
//             "originDate": "2025-01-29",
//             "rootType": "lunar"
//         },

const Holidays = () => {
    const holidays = useAppSelector((state) => state.common.holidays.solarHolidays);
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.common.holidays.loadings.getSolarHolidays);
    const error = useAppSelector((state) => state.common.holidays.errors.getSolarHolidays);
    useEffect(() => {
      if(!holidays || holidays.length === 0){
        dispatch(getSolarHolidays());
      }
    }, [dispatch]);

    if(isLoading) {
        return <Loading/>
    }

  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
        <h1 className="text-2xl font-bold text-center">Holidays</h1>
        <div>
            {
                holidays && holidays.map((holiday) => (
                    <div key={holiday.date + holiday.name} className="border-b border-gray-200 py-2">
                        <h2 className="text-xl font-semibold">{holiday.name}</h2>
                        <p>{dayjs(holiday.date).format("DD/MM/YYYY")}</p>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Holidays