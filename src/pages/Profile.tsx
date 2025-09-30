export function Profile() {
  return (
    <div>
      <div className="glass-panel rounded-2xl p-6 text-center">
              <div className="bg-primary/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Agente #{Math.floor(Math.random() * 9999)}</h2>
              <p className="text-sm text-foreground/70 mt-1">Missão: Transformar o Mundo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-panel border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">Carteira Digital</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">NFTs Coletados</span>
                      <span className="font-bold">{collectedNFTs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total de NFTs</span>
                      <span className="font-bold">{clubs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Taxa de Conclusão</span>
                      <span className="font-bold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">Estatísticas</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Missões Completas</span>
                      <span className="font-bold">{completedMissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Clubes Visitados</span>
                      <span className="font-bold">{collectedNFTs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Pontos de Impacto</span>
                      <span className="font-bold">{collectedNFTs.length * 100}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel border-0">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Raridade da Coleção</h3>
                <div className="space-y-3">
                  {Object.entries(rarityColors).map(([rarity, color]) => {
                    const count = getRarityCount(rarity as Rarity);
                    const total = clubs.filter(c => c.rarity === rarity).length;
                    const percent = (count / total) * 100;
                    
                    return (
                      <div key={rarity}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{rarity}</span>
                          <span className="font-bold">{count}/{total}</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
    </div>
  )
}