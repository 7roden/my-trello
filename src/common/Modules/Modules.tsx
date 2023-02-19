import Swal from 'sweetalert2';

export function isValidTitle(title: string): boolean {
  const invalidСhar = title.replace(/[a-zа-яё0-9\n_.\-\s]/gi, '');
  if (title.trim().length && !invalidСhar.length) return true;

  if (!title.trim()) Swal.fire('ERROR','You did not enter a name','warning');

  if (invalidСhar.length)
    Swal.fire('ERROR',
      'There is impossible characters in the name: '.concat(invalidСhar),'warning'
    );

  return false;
}
