export function Collection() {  
  const rarityColors: Record<Rarity, string> = {
    comum: "bg-muted text-foreground",
    rara: "bg-primary/20 text-primary",
    épica: "bg-accent/20 text-accent",
    lendária: "bg-secondary/20 text-secondary",
  };

  const getRarityCount = (rarity: Rarity) => {
    return clubs.filter(c => c.rarity === rarity && collectedNFTs.includes(c.id)).length;
  };
  return (
    <div>
      <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Coleção de NFTs
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(rarityColors).map(([rarity, color]) => (
                  <div key={rarity} className="glass-panel rounded-xl p-4 text-center">
                    <div className={`${color} rounded-lg p-2 mb-2 font-bold capitalize`}>
                      {rarity}
                    </div>
                    <div className="text-2xl font-bold">
                      {getRarityCount(rarity as Rarity)}/{clubs.filter(c => c.rarity === rarity).length}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clubs.map((club) => {
                const isCollected = collectedNFTs.includes(club.id);
                const Icon = club.icon;

                return (
                  <Card
                    key={club.id}
                    className={`glass-panel border-0 transition-all ${isCollected ? 'hover:scale-105' : 'opacity-60'}`}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`${club.bgColor} p-4 rounded-xl mx-auto w-fit`}>
                        {isCollected ? (
                          <Icon className={`h-8 w-8 ${club.color}`} />
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center text-2xl">?</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{isCollected ? club.name : "???"}</p>
                        <Badge className={`${rarityColors[club.rarity]} mt-2`}>
                          {isCollected ? club.rarity : "???"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
    </div>
  )
}