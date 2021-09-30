import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import 'dayjs/locale/nb';

dayjs.locale('nb');
dayjs.extend(advancedFormat);

export default dayjs;
