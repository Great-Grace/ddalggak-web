export function initializePaddle(options = {}) {
  return new Promise((resolve, reject) => {
    const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN || import.meta.env.VITE_PADDLE_SELLER_ID;
    const environment = token && String(token).startsWith('test_') ? 'sandbox' : 'production';

    if (!token || token === '352475') {
      console.warn('Paddle Warning: Please configure VITE_PADDLE_CLIENT_TOKEN in your .env file. Seller ID cannot be used as a client-side token.');
    }

    if (window.Paddle) {
      if (environment === 'sandbox') {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Initialize({
        token: token,
        eventCallback: options.eventCallback,
      });
      resolve(window.Paddle);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;
    
    script.onload = () => {
      setTimeout(() => {
        if (window.Paddle) {
          if (environment === 'sandbox') {
            window.Paddle.Environment.set('sandbox');
          }
          window.Paddle.Initialize({
            token: token,
            eventCallback: options.eventCallback,
          });
          resolve(window.Paddle);
        } else {
          reject(new Error('Paddle not available'));
        }
      }, 100);
    };
    
    script.onerror = () => reject(new Error('Failed to load Paddle'));
    document.head.appendChild(script);
  });
}

export function openCheckout() {
  if (!window.Paddle) {
    console.error('Paddle not loaded');
    return;
  }

  window.Paddle.Checkout.open({
    items: [{
      priceId: import.meta.env.VITE_PADDLE_PRICE_ID,
      quantity: 1,
    }],
    settings: {
      displayMode: 'overlay',
      theme: 'dark',
      locale: 'ko',
    },
  });
}

export function getPaddle() {
  return window.Paddle;
}
