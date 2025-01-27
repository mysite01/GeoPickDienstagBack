import { Player } from "../../src/model/PlayerModel";

test("CreatePlayer test", async () => {
    const player = await Player.create({ nickName: "Harry", host: true})
    expect(player).toBeTruthy();
})

test("FindPlayer test", async () => {
    const player = await Player.create({ nickName: "Harry", host: false})
    const foundPlayer = await Player.findOne({ nickName: "Harry"})
    expect(foundPlayer).toBeTruthy();
})
