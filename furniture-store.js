/**
 * Parrow's Signature — Furniture Inventory & Admin Security Store
 * Shared client-side persistence module for the Immersive Furniture Carousel and Admin Portal.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ParrowsStore = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'parrows_furniture_inventory_v1';
  const AUTH_KEY = 'parrows_admin_session_v1';
  const ATTEMPTS_KEY = 'parrows_admin_attempts_v1';

  // Pre-hashed SHA-256 for studio passphrases:
  // "parrows2026" -> b58a6a22611ecacda01b521f96ea1184e919201255c48c2b521418c0cc975176
  // "signature"   -> 1a2fc26dc7ea5a2a4748b7cb2b1ef193d96ab2c99f93092f69e63075b28d1278
  const VALID_HASHES = [
    'b58a6a22611ecacda01b521f96ea1184e919201255c48c2b521418c0cc975176', // parrows2026
    '1a2fc26dc7ea5a2a4748b7cb2b1ef193d96ab2c99f93092f69e63075b28d1278'  // signature
  ];

  // Default Luxury Catalogue Items
  const DEFAULT_ITEMS = [
    {
      id: 'furn-01',
      title: 'The Senchi Fluted Credenza',
      category: 'Credenzas & Storage',
      tag: '01 / ARCHITECTURAL JOINERY',
      materials: 'Solid American Walnut, Aged Antique Brass Reveal, Blum Soft-Close Hinges',
      dimensions: 'W: 2400mm · D: 520mm · H: 760mm',
      status: 'Available in Studio',
      leadTime: 'Immediate Delivery (Accra)',
      priceGuide: 'Custom Inquiries Welcome',
      description: 'An architectural centerpiece crafted with hand-selected solid American walnut. Features continuous grain wrapping, precision fluted vertical relief, recessed antique brass shadowline detailing, and internal leather-lined shelving.',
      image: 'assets/INT_Storage.jpg',
      featured: true,
      created: 1728800000000
    },
    {
      id: 'furn-02',
      title: 'The Cantonments Modular Lounge',
      category: 'Seating & Lounges',
      tag: '02 / BESPOKE UPHOLSTERY',
      materials: 'Belgian Bouclé Linen (Oatmeal), FSC Solid Walnut Platform, High-Density Down Fill',
      dimensions: 'W: 3200mm · D: 1100mm · Seat H: 410mm',
      status: 'Available (1 Suite)',
      leadTime: 'Immediate Delivery',
      priceGuide: 'POA · Studio Viewing Available',
      description: 'Designed for generous tropical living and effortless lounging. Deep monolithic proportions resting atop a floating walnut plinth with dual-density down cushioning and stain-resistant Belgian bouclé textile.',
      image: 'assets/INT01_Penthouse-Living.jpg',
      featured: true,
      created: 1728801000000
    },
    {
      id: 'furn-03',
      title: 'Airport Hills Monolith Dining Table',
      category: 'Dining & Tables',
      tag: '03 / SCULPTURAL DINING',
      materials: 'American Walnut Solid Planks (45mm), Hand-Rubbed Hardwax Oil, Bronzed Base',
      dimensions: 'W: 2800mm · D: 1100mm · H: 750mm (Seats 10)',
      status: 'Made to Order',
      leadTime: '4 - 6 Weeks Crafting',
      priceGuide: 'Commissioned on Order',
      description: 'Sculpted from select walnut planks displaying natural continuous flow. Features a delicate under-bevel edge profile that makes the heavy timber table float effortlessly in modern Ghanaian architecture.',
      image: 'assets/INT03_Courtyard-Living-Dining.jpg',
      featured: true,
      created: 1728802000000
    },
    {
      id: 'furn-04',
      title: 'The Ridge Honed Travertine Plinth',
      category: 'Occasional & Accent',
      tag: '04 / NOBLE STONE',
      materials: 'Italian Roman Travertine (Honed Unfilled), Concealed Castors',
      dimensions: 'W: 1200mm · D: 800mm · H: 380mm',
      status: 'Available in Studio',
      leadTime: 'Ready for Dispatch',
      priceGuide: 'Limited Edition (Piece 2 of 4)',
      description: 'A monolithic low table showcasing the geological poetry of natural honed Roman travertine. Balanced with shadow reveals and invisible felt castors for effortless positioning across timber and stone floors.',
      image: 'assets/finishes/stone.jpg',
      featured: false,
      created: 1728803000000
    },
    {
      id: 'furn-05',
      title: 'Fluted Walnut Architectural Island Suite',
      category: 'Kitchen & Bar Joinery',
      tag: '05 / CUSTOM WORKSHOP',
      materials: 'Quarter-Sawn Walnut Veneer, Quartzite Surface, Integrated 2700K Warm LED',
      dimensions: 'Bespoke Sizing · Tailored to Floorplan',
      status: 'Commission Only',
      leadTime: '6 - 8 Weeks Turnkey',
      priceGuide: 'Integrated Architectural Scope',
      description: 'Engineered as the social hearth of high-end private residences. Meticulously joined fluted timber slats with integrated concealed bar storage, charging compartments, and recessed ambient warmth.',
      image: 'assets/INT04_Kitchen-Light.jpg',
      featured: false,
      created: 1728804000000
    },
    {
      id: 'furn-06',
      title: 'The Ambassador Executive Desk',
      category: 'Executive & Study',
      tag: '06 / EXECUTIVE PRIVATE',
      materials: 'Blackened Solid Walnut, Italian Saddle Leather Desk Pad, Antique Brass Cable Port',
      dimensions: 'W: 2200mm · D: 950mm · H: 750mm',
      status: 'Available in Studio',
      leadTime: 'Immediate Delivery (Accra)',
      priceGuide: 'Exclusive Suite',
      description: 'Crafted for private office sanctuaries in Ridge and Cantonments. Imbued with masculine elegance, featuring flush-set full-grain leather inlay, silent push-touch drawers, and concealed tech management.',
      image: 'assets/COM03_Office.jpg',
      featured: false,
      created: 1728805000000
    }
  ];

  /* -------------------------------------------------------------
     Helper Utilities
     ------------------------------------------------------------- */
  async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function getStoredItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading furniture inventory:', e);
    }
    // Initialize defaults if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ITEMS));
    return DEFAULT_ITEMS.slice();
  }

  function saveItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('parrows_inventory_changed', { detail: { items } }));
  }

  // Client-side image compressor using HTML5 canvas
  // Keeps photos under 200KB DataURL to prevent localStorage quota exhaustion!
  function compressImage(file, maxDimension = 1400, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          let { width, height } = img;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* -------------------------------------------------------------
     Inventory Store API
     ------------------------------------------------------------- */
  const FurnitureStore = {
    getAll() {
      return getStoredItems();
    },

    getById(id) {
      return getStoredItems().find(item => item.id === id) || null;
    },

    add(itemData) {
      const items = getStoredItems();
      const newItem = {
        id: 'furn-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
        title: itemData.title || 'Untitled Signature Piece',
        category: itemData.category || 'Bespoke Furnishing',
        tag: itemData.tag || 'NEW / STUDIO ADDITION',
        materials: itemData.materials || 'Solid American Walnut, Natural Finishes',
        dimensions: itemData.dimensions || 'Bespoke Dimensions',
        status: itemData.status || 'Available in Studio',
        leadTime: itemData.leadTime || 'Consult Studio for Timeline',
        priceGuide: itemData.priceGuide || 'Price on Application',
        description: itemData.description || 'Custom crafted by Parrow’s Signature workshop in Accra.',
        image: itemData.image || 'assets/INT_Storage.jpg',
        featured: Boolean(itemData.featured),
        created: Date.now()
      };
      items.unshift(newItem);
      saveItems(items);
      return newItem;
    },

    update(id, updatedFields) {
      const items = getStoredItems();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...updatedFields, updated: Date.now() };
      saveItems(items);
      return items[index];
    },

    remove(id) {
      const items = getStoredItems();
      const filtered = items.filter(item => item.id !== id);
      if (filtered.length !== items.length) {
        saveItems(filtered);
        return true;
      }
      return false;
    },

    resetToDefaults() {
      saveItems(DEFAULT_ITEMS.slice());
      return DEFAULT_ITEMS.slice();
    },

    subscribe(callback) {
      const handler = (e) => {
        if (e.type === 'storage' && e.key === STORAGE_KEY) {
          callback(getStoredItems());
        } else if (e.type === 'parrows_inventory_changed') {
          callback(e.detail.items);
        }
      };
      window.addEventListener('storage', handler);
      window.addEventListener('parrows_inventory_changed', handler);
      return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener('parrows_inventory_changed', handler);
      };
    },

    compressImage
  };

  /* -------------------------------------------------------------
     Admin Authentication API
     ------------------------------------------------------------- */
  const AdminAuth = {
    isAuthenticated() {
      try {
        const session = sessionStorage.getItem(AUTH_KEY);
        if (!session) {
          // Check remember-token in localStorage
          const local = localStorage.getItem(AUTH_KEY);
          if (local) {
            const data = JSON.parse(local);
            if (data.exp && data.exp > Date.now()) {
              return true;
            }
          }
          return false;
        }
        const data = JSON.parse(session);
        return Boolean(data.auth && data.exp > Date.now());
      } catch (_) {
        return false;
      }
    },

    getLockout() {
      try {
        const raw = sessionStorage.getItem(ATTEMPTS_KEY);
        if (!raw) return { count: 0, lockedUntil: 0 };
        return JSON.parse(raw);
      } catch (_) {
        return { count: 0, lockedUntil: 0 };
      }
    },

    recordFailedAttempt() {
      const lockout = this.getLockout();
      lockout.count = (lockout.count || 0) + 1;
      if (lockout.count >= 5) {
        // Lock for 60 seconds
        lockout.lockedUntil = Date.now() + 60000;
      }
      sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(lockout));
      return lockout;
    },

    resetAttempts() {
      sessionStorage.removeItem(ATTEMPTS_KEY);
    },

    async login(passphrase, remember = false) {
      const lockout = this.getLockout();
      if (lockout.lockedUntil && lockout.lockedUntil > Date.now()) {
        const remaining = Math.ceil((lockout.lockedUntil - Date.now()) / 1000);
        return { success: false, error: `Too many failed attempts. Locked for ${remaining}s.` };
      }

      const inputHash = await sha256(passphrase);
      if (VALID_HASHES.includes(inputHash)) {
        this.resetAttempts();
        const sessionPayload = {
          auth: true,
          user: 'Studio Admin',
          exp: Date.now() + (remember ? 7 * 86400000 : 4 * 3600000)
        };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(sessionPayload));
        if (remember) {
          localStorage.setItem(AUTH_KEY, JSON.stringify(sessionPayload));
        }
        return { success: true };
      }

      const updated = this.recordFailedAttempt();
      if (updated.count >= 5) {
        return { success: false, error: 'Too many failed attempts. Account locked for 60 seconds.' };
      }
      return { success: false, error: `Invalid studio credentials. (${5 - updated.count} attempts left)` };
    },

    logout() {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
    }
  };

  return {
    FurnitureStore,
    AdminAuth,
    DEFAULT_ITEMS
  };
}));
