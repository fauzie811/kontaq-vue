import parseJSON from 'date-fns/parseJSON';
import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import id from 'date-fns/locale/id';

export const shortDate = (date) =>
    format(parseJSON(date), 'd MMM yyyy', { locale: id });

export const relativeDate = (date) =>
    formatRelative(parseJSON(date), new Date(), { locale: id });

export const stripTags = (text) => text.replace(/(<([^>]+)>)/gi, '');
