import Swal from 'sweetalert2';
import parseJSON from 'date-fns/parseJSON';
import format from 'date-fns/format';
import formatRelative from 'date-fns/formatRelative';
import id from 'date-fns/locale/id';

export const shortDate = (date) =>
    format(parseJSON(date), 'd MMM yyyy', { locale: id });

export const relativeDate = (date) =>
    formatRelative(parseJSON(date), new Date(), { locale: id });

export const shortDateTime = (date) =>
    format(parseJSON(date), "d MMM yyyy 'pukul' HH:mm", { locale: id });

export const dayDateTime = (date) =>
    format(parseJSON(date), "EEEE, d MMM yyyy 'pukul' HH:mm", { locale: id });

export const stripTags = (text) => text.replace(/(<([^>]+)>)/gi, '');

const icons = (name) =>
    ({
        success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>`,
        warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
</svg>`,
    }[name] ||
    `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
</svg>`);

const iconColor = (name) =>
    ({
        success: 'bg-primary/10! text-primary!',
        warning: 'bg-amber-500/10! text-amber-600!',
    }[name] || 'bg-primary/10! text-primary!');

export const swAlert = ({
    text,
    title = '',
    icon = 'success',
    buttonText = 'Tutup',
}) =>
    Swal.fire({
        buttonsStyling: false,
        icon,
        iconHtml: icons(icon),
        title,
        text,
        confirmButtonText: buttonText,
        customClass: {
            popup: 'relative! transform! overflow-hidden! rounded-3xl! bg-card! text-card-foreground! text-center! shadow-2xl! border! border-border! transition-all! sm:my-8! sm:w-full! sm:max-w-md! p-6! sm:p-8! grid-cols-none!',
            icon:
                'm-0! mx-auto! flex! h-14! w-14! shrink-0! items-center! justify-center! rounded-full! border-0! mb-4! shadow-inner! col-start-1! col-end-3! ' +
                iconColor(icon),
            title: 'p-0! text-center! text-xl! font-bold! leading-tight! text-foreground! mb-2! col-start-1! col-end-3!',
            htmlContainer:
                'mt-1! m-0! text-center! text-sm! text-muted-foreground! leading-relaxed! mb-6! col-start-1! col-end-3!',
            actions:
                'flex! flex-col! sm:flex-row-reverse! gap-2.5! w-full! p-0! bg-transparent! border-0! justify-center! mt-0! col-start-1! col-end-3!',
            confirmButton:
                'w-full! py-2.5! px-4! bg-primary! hover:bg-primary/90! text-primary-foreground! font-bold! rounded-full! shadow-xs! transition-all! duration-150! cursor-pointer! text-sm! flex! items-center! justify-center!',
        },
    });

export const swConfirm = ({
    text,
    title = '',
    icon = 'success',
    confirmButtonText = 'OK',
    cancelButtonText = 'Batal',
}) =>
    Swal.fire({
        buttonsStyling: false,
        icon,
        iconHtml: icons(icon),
        title,
        text,
        confirmButtonText,
        cancelButtonText,
        showCancelButton: true,
        customClass: {
            popup: 'relative! transform! overflow-hidden! rounded-3xl! bg-card! text-card-foreground! text-center! shadow-2xl! border! border-border! transition-all! sm:my-8! sm:w-full! sm:max-w-md! p-6! sm:p-8! grid-cols-none!',
            icon:
                'm-0! mx-auto! flex! h-14! w-14! shrink-0! items-center! justify-center! rounded-full! border-0! mb-4! shadow-inner! col-start-1! col-end-3! ' +
                iconColor(icon),
            title: 'p-0! text-center! text-xl! font-bold! leading-tight! text-foreground! mb-2! col-start-1! col-end-3!',
            htmlContainer:
                'mt-1! m-0! text-center! text-sm! text-muted-foreground! leading-relaxed! mb-6! col-start-1! col-end-3!',
            actions:
                'flex! flex-col-reverse! sm:flex-row-reverse! gap-2.5! w-full! p-0! bg-transparent! border-0! justify-center! mt-0! col-start-1! col-end-3!',
            confirmButton:
                'w-full! sm:flex-1! py-2.5! px-4! bg-primary! hover:bg-primary/90! text-primary-foreground! font-bold! rounded-full! shadow-xs! transition-all! duration-150! cursor-pointer! text-sm! flex! items-center! justify-center!',
            cancelButton:
                'w-full! sm:flex-1! py-2.5! px-4! bg-secondary! hover:bg-secondary/80! text-secondary-foreground! font-bold! rounded-full! border! border-border! transition-all! duration-150! cursor-pointer! text-sm! flex! items-center! justify-center!',
        },
    });
