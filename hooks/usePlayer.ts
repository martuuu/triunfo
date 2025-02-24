import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';

interface Player {
  id: string;
  name: string;
  emoji?: string;
  email?: string;
}

interface UsePlayerReturn {
  player: Player | null;
  isLoading: boolean;
  error: Error | null;
}

export const usePlayer = (playerId: string): UsePlayerReturn => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('id', playerId)
          .single();

        if (error) throw error;

        setPlayer(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch player'));
      } finally {
        setIsLoading(false);
      }
    };

    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  return { player, isLoading, error };
};