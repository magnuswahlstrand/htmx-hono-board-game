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
    - [ ] Add a boss
- [ ] Effects
    - [x] Attack
    - [x] Defense
    - [x] Poison
    - [x] Heal
    - [x] Stun
- [ ] Fixes
    - [ ] All card effects
    - [ ] Cap actions per turn
    - [ ] Remove camp
- [ ] Bugs
    - [x] Layout of reward screen
- [x] Show character and monster status
- [ ] Add game over screen
- [ ] Minor
    - [ ] Set status bar to permanent height

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