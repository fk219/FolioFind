import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthProvider';
import * as shelfApi from '../api/shelf';

export const ShelfContext = createContext(null);

const emptyCounts = { 'want-to-read': 0, reading: 0, finished: 0 };

export function ShelfProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState(emptyCounts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      setCounts(emptyCounts);
      setError('');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await shelfApi.getShelf({ token });
      setItems(result.items || []);
      setCounts({ ...emptyCounts, ...(result.counts || {}) });
    } catch {
      setError('Your reading room could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(
    async (bookId, status, note) => {
      const result = await shelfApi.saveShelfItem({ token, bookId, status, note });
      await refresh();
      return result;
    },
    [token, refresh]
  );

  const remove = useCallback(
    async (bookId) => {
      const result = await shelfApi.removeShelfItem({ token, bookId });
      await refresh();
      return result;
    },
    [token, refresh]
  );

  const value = useMemo(() => {
    const byBook = new Map(items.map((item) => [String(item._id), item]));
    return {
      items,
      counts,
      loading,
      error,
      refresh,
      save,
      remove,
      getItem: (bookId) => byBook.get(String(bookId)) || null
    };
  }, [items, counts, loading, error, refresh, save, remove]);

  return <ShelfContext.Provider value={value}>{children}</ShelfContext.Provider>;
}
