```
npm install
npm run dev
```

```
npm run deploy
```

# Next steps

- [x] Add landing page
- [x] Fix card position
- [x] Fix HP bug
- [x] Other cards in rewards
- [ ] Monsters
    - [x] Goblin
    - [ ] Skeleton
    - [ ] Bat
    - [ ] Mushroom
- [ ] Effects
    - [ ] Attack
    - [ ] Defense
    - [x] Poison
    - [ ] Heal
    - [x] Stun
- [ ] Fixes
    - [ ] All card effects
- [ ] Bugs
    - [ ] 
- [ ] Show character and monster status
- [ ] Add game over screen

# Round breakdown

- Before round
    - Draw cards
    - Decide monster action
- Before player
    - Skip if stun
    - Apply poison
    - Remove defense
- Waiting for player
- Before monster
    - Skip if stun
    - Apply poison
    - Remove defense
- Monster
- After round

# Resources

- https://thekevinwang.com/2024/05/11/on-durable-objects
- https://boardgame.io/documentation/#/api/Game - My engine is heavily inspired by boardgame.io.
- Icons from https://shikashipx.itch.io/shikashis-fantasy-icons-pack