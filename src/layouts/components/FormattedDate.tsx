'use client';

import { useRTL } from '@/src/hooks/useRTL';
import dateFormat from '@lib/utils/dateFormat';

interface FormattedDateProps {
  date: string | number | Date;
}

const FormattedDate = ({ date }: FormattedDateProps) => {
  const { isRTL } = useRTL();
  return <>{dateFormat(date, isRTL ? 'fa' : 'en')}</>;
};

export default FormattedDate;
