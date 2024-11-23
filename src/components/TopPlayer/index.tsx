import React from 'react';

interface TopPlayer {
  id: number;
  name: string;
  score: number;
  avatar: string;
  rank: number;
}

interface TopPlayersProps {
  players: TopPlayer[];
}

const TopPlayers: React.FC<TopPlayersProps> = ({ players }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-4">
        {players.slice(0, 3).map((player) => (
          <div key={player.id} className="flex flex-col items-center">
            <div className={`relative w-20 h-20 ${
              player.rank === 1 ? 'bg-yellow-500' :
              player.rank === 2 ? 'bg-gray-400' :
              'bg-orange-500'
            } rounded-xl p-0.5`}>
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-xl" />
              <div className={`absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 ${
                player.rank === 1 ? 'bg-yellow-500' :
                player.rank === 2 ? 'bg-gray-400' :
                'bg-orange-500'
              } rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold">{player.rank}</span>
              </div>
            </div>
            <span className="text-white font-semibold mt-4">{player.name}</span>
            <div className="flex items-center mt-1">
              <span className="text-yellow-500 font-bold">{(player.score / 1000000).toFixed(1)}M</span>
              <img src="/images/coin_1.png" alt="Coin" className="ml-1 w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
      {players.slice(3).map((player) => (
        <div key={player.id} className="bg-[#1A1F37] rounded-xl p-4 flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full mr-3 flex items-center justify-center text-white">
              <span className="font-bold">{player.rank}</span>
            </div>
            <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-xl mr-3" />
            <span className="text-white font-semibold">{player.name}</span>
          </div>
          <span className="text-yellow-500 font-bold flex items-center">
            {(player.score / 1000000).toFixed(1)}M
            <img src="/images/coin_1.png" alt="Coin" className="ml-1 w-4 h-4" />
          </span>
        </div>
      ))}
    </div>
  );
};

export default TopPlayers;

