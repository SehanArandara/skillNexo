export const PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID;
export const TEST_EVENT_CODE = import.meta.env.VITE_FB_TEST_EVENT_CODE;

export const initPixel = () => {
    if (!PIXEL_ID) {
        console.warn('Meta Pixel ID not found in environment variables.');
        return;
    }

    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('init', PIXEL_ID);
        window.fbq('track', 'PageView');
        console.log('Meta Pixel Initialized:', PIXEL_ID);
    }
};

export const trackRegistration = (data = {}) => {
    if (typeof window !== 'undefined' && window.fbq) {
        const options = {};
        if (TEST_EVENT_CODE) {
            options.test_event_code = TEST_EVENT_CODE;
        }

        window.fbq('track', 'CompleteRegistration', {
            content_name: data.course_name || 'Student Registration',
            status: 'success',
            ...data
        }, options);

        console.log('Meta Pixel Tracked: CompleteRegistration', options);
    }
};

export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
};
