export function Clubs() {
  return (
    <div>

                  <div className="glass-panel rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-2">Clubes do Inteli</h2>
                    <p className="text-sm text-foreground/70">
                      Conheça os clubes estudantis e suas especialidades
                    </p>
                  </div>
      
                  <div className="space-y-4">
                    {clubs.map((club, index) => {
                      const Icon = club.icon;
                      const isCollected = collectedNFTs.includes(club.id);
      
                      return (
                        <Card
                          key={club.id}
                          className="glass-panel border-0 animate-fade-in"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`${club.bgColor} p-4 rounded-xl`}>
                                <Icon className={`h-8 w-8 ${club.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-lg">{club.name}</h3>
                                    <p className="text-sm text-foreground/70">{club.description}</p>
                                  </div>
                                  {isCollected && (
                                    <Badge className="bg-secondary text-foreground">NFT Coletado</Badge>
                                  )}
                                </div>
                                <div className="flex gap-4 text-sm text-foreground/70 mt-3">
                                  <span>👥 {club.members} membros</span>
                                  <span>📅 Fundado em {club.founded}</span>
                                  <Badge className={rarityColors[club.rarity]}>{club.rarity}</Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
    </div>
  )
}