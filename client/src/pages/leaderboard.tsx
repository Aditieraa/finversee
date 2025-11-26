import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';

interface LeaderboardEntry {
  name: string;
  level: number;
  netWorth: number;
  rank: number;
}

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('game_saves')
          .select('game_state')
          .order('game_state->>netWorth', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Leaderboard fetch error:', error);
          return;
        }

        if (data) {
          const entries: LeaderboardEntry[] = data
            .map((save: any, idx: number) => {
              const gameState = save.game_state;
              return {
                name: gameState?.userProfile?.name || 'Anonymous',
                level: gameState?.level || 1,
                netWorth: gameState?.netWorth || 0,
                rank: idx + 1,
              };
            })
            .filter(entry => entry.netWorth > 0);

          setPlayers(entries);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-400" />
            Top Players
          </h1>
          <p className="text-blue-200/60 text-sm mt-1">Real-time global rankings</p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/50 text-sm px-3 py-1">
          <Users className="h-4 w-4 mr-1 inline" />
          Real Players
        </Badge>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {loading ? (
          <Card className="border-blue-400/20 bg-blue-950/40 p-8">
            <p className="text-blue-200 text-center animate-pulse">Loading leaderboard...</p>
          </Card>
        ) : players.length === 0 ? (
          <Card className="border-blue-400/20 bg-blue-950/40 p-8">
            <p className="text-blue-200/60 text-center">No players yet. Be the first!</p>
          </Card>
        ) : (
          players.map((player, idx) => {
            const medalColors = {
              1: 'from-yellow-500/20 to-yellow-600/10',
              2: 'from-gray-500/20 to-gray-600/10',
              3: 'from-orange-500/20 to-orange-600/10',
            };
            const textColors = {
              1: 'text-yellow-300',
              2: 'text-gray-300',
              3: 'text-orange-300',
            };
            const borderColors = {
              1: 'border-yellow-400/30',
              2: 'border-gray-400/30',
              3: 'border-orange-400/30',
            };

            const bgClass = idx < 3 
              ? `bg-gradient-to-br ${medalColors[player.rank as keyof typeof medalColors]}`
              : 'bg-blue-950/40';
            const textClass = idx < 3
              ? textColors[player.rank as keyof typeof textColors]
              : 'text-blue-100';
            const borderClass = idx < 3
              ? borderColors[player.rank as keyof typeof borderColors]
              : 'border-blue-400/20';

            return (
              <Card key={player.rank} className={`border-2 ${borderClass} ${bgClass} backdrop-blur-sm p-4 hover-elevate`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${textClass} w-12 text-center`}>
                      #{player.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-lg">{player.name}</p>
                      <p className={`text-sm ${textClass}`}>Level {player.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${textClass}`}>
                      ₹{player.netWorth.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-foreground/60">Net Worth</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer */}
      {players.length > 0 && (
        <Card className="border-blue-400/20 bg-blue-950/40 p-4">
          <p className="text-center text-sm text-blue-200/60">
            Leaderboard updates every 10 seconds • Build your empire to claim the top spot!
          </p>
        </Card>
      )}
    </div>
  );
}
