import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';
// @ts-ignore
import avatar1 from '@assets/generated_images/female_professional_avatar.png';
// @ts-ignore
import avatar2 from '@assets/generated_images/male_professional_avatar.png';
// @ts-ignore
import avatar3 from '@assets/generated_images/woman_curly_hair_avatar.png';
// @ts-ignore
import avatar4 from '@assets/generated_images/man_blonde_hair_avatar.png';
// @ts-ignore
import avatar5 from '@assets/generated_images/woman_red_hair_avatar.png';
// @ts-ignore
import avatar6 from '@assets/generated_images/man_brown_hair_avatar.png';

interface LeaderboardEntry {
  name: string;
  level: number;
  netWorth: number;
  rank: number;
  avatar?: string;
}

const avatarMap: Record<string, string> = {
  female1: avatar1,
  male1: avatar2,
  female2: avatar3,
  male2: avatar4,
  female3: avatar5,
  male3: avatar6,
};

const getAvatarUrl = (avatarId?: string) => avatarId ? avatarMap[avatarId] : avatar1;

export default function Leaderboard() {
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Query game_saves with profile data and order by level
        const { data, error } = await supabase
          .from('game_saves')
          .select('level, cash_balance, portfolio, user_id')
          .eq('is_latest', true)
          .order('cash_balance', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Leaderboard fetch error:', error);
          return;
        }

        if (data && data.length > 0) {
          // Get user profiles for avatars and names
          const userIds = data.map((save: any) => save.user_id);
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, name, avatar')
            .in('id', userIds);

          // Create profile map by user ID
          const profileMap = (profilesData || []).reduce((acc: any, profile: any) => {
            acc[profile.id] = profile;
            return acc;
          }, {});

          // Create leaderboard entries
          const entries: LeaderboardEntry[] = data
            .map((save: any, idx: number) => {
              // Calculate net worth from cash_balance and portfolio
              const portfolio = save.portfolio || {};
              const portfolioTotal = Object.values(portfolio).reduce((sum: number, val: any) => sum + (val || 0), 0);
              const netWorth = (save.cash_balance || 0) + portfolioTotal;
              
              // Get profile info
              const profile = profileMap[save.user_id];
              const avatarId = profile?.avatar || 'female1';
              const avatarPath = avatarMap[avatarId] || avatar1;
              
              return {
                name: profile?.name || 'Anonymous',
                level: save.level || 1,
                netWorth,
                rank: idx + 1,
                avatar: avatarPath,  // Use actual avatar image path
              };
            })
            .filter(entry => entry.level > 0 && entry.netWorth > 0) // Only show players with progress
            .slice(0, 10); // Top 10

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
              1: 'from-yellow-400/30 via-yellow-500/20 to-amber-600/10',
              2: 'from-slate-300/30 via-slate-400/20 to-slate-600/10',
              3: 'from-orange-400/30 via-orange-500/20 to-orange-600/10',
            };
            const textColors = {
              1: 'text-yellow-200',
              2: 'text-slate-200',
              3: 'text-orange-200',
            };
            const borderColors = {
              1: 'border-yellow-400/50 shadow-lg shadow-yellow-500/20',
              2: 'border-slate-400/50 shadow-lg shadow-slate-400/20',
              3: 'border-orange-400/50 shadow-lg shadow-orange-500/20',
            };
            const shadowClass = idx < 3
              ? `${borderColors[player.rank as keyof typeof borderColors]} animate-celebratory`
              : '';

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
              <Card key={player.rank} className={`border-2 ${borderClass} ${bgClass} backdrop-blur-md p-4 hover-elevate ${shadowClass}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {player.avatar && (
                      <div className="w-12 h-14 rounded overflow-hidden border border-primary/50 flex-shrink-0">
                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`text-2xl font-bold ${textClass} w-8 text-center`}>
                      #{player.rank}
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
