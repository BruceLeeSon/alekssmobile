/* ============================================================
   КОНФИГУРАЦИЯ УСЛУГ
   ============================================================
   Чтобы ДОБАВИТЬ услугу:
   1. Скопируйте любую строку { ... },
   2. Вставьте её в нужное место,
   3. Поменяйте name / file / icon.

   Чтобы УДАЛИТЬ услугу:
   1. Удалите всю строку { ... }, целиком.

   Поля:
   - name:  Название услуги (отображается на карточке)
   - file:  Имя файла без расширения в папке img/services/
            (поддерживаются .gif, .webp, .mp4, .webm)
   - icon:  FontAwesome-иконка (fallback, если медиа не найдено)
            Список: https://fontawesome.com/search?o=r&m=free
   - showInForm: true — показывать в выпадающем списке формы бронирования
                 false — только карточка, без опции в форме
   ============================================================ */

const SERVICES_CONFIG = [
    {
        name: 'Selection & Sale of New Tires',
        file: 'tire-sale',
        icon: 'fa-circle-notch',
        showInForm: true
    },
    {
        name: 'Tire Mounting & Demounting',
        file: 'tire-mounting',
        icon: 'fa-screwdriver-wrench',
        showInForm: true
    },
    {
        name: 'Tire Repair',
        file: 'tire-repair',
        icon: 'fa-band-aid',
        showInForm: true
    },
    {
        name: 'Help on the Road',
        file: 'road-help',
        icon: 'fa-car-burst',
        showInForm: true
    },
    {
        name: 'Wheel Balancing',
        file: 'wheel-balancing',
        icon: 'fa-circle-dot',
        showInForm: true
    },
    {
        name: 'TPMS Replacement & Programming',
        file: 'tpms',
        icon: 'fa-triangle-exclamation',
        showInForm: true
    },
    {
        name: 'Brake Pads & Rotor Replacement',
        file: 'brakes',
        icon: 'fa-car-burst',
        showInForm: true
    },
    {
        name: 'Suspension Repair & Component Replacement',
        file: 'suspension',
        icon: 'fa-car-side',
        showInForm: true
    }
];