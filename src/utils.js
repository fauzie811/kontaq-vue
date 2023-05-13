import parseJSON from 'date-fns/parseJSON';
import format from 'date-fns/format';
import id from 'date-fns/locale/id';

export const shortDate = (date) =>
    format(parseJSON(date), 'd MMM yyyy', { locale: id });
