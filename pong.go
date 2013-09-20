package main

import (
	"fmt"
)

/*
"encoding/json"

	"strconv"
	"io/ioutil"
	"net/http"
*/

/* A set of scripts that are called when Pong is enabled.  When a control input is sent and the input is calibrated, if pong is enabled we send the appropriate draw commands.
 */

type PongPlayer struct {
    Y      int `json:"y"`
    Score      int `json:"score"`
}

type PongState struct {
	BallX        int `json:"ballX"`
	BallY        int `json:"ballY"`
	BallDX       int `json:"ballDX"`
	BallDY       int `json:"ballDY"`
	PlayerL      PongPlayer `json:"playerL"`
	PlayerR      PongPlayer `json:"playerR"`
	Width        int `json:"width"`
	Height       int `json:"height"`
	PlayerRadius int `json:"playerRadius"`
	PlayerWidth  int `json:"playerWidth"`
	PlayerSpeed  int `json:"playerSpeed"`
	BallRadius   int `json:"ballRadius"`
}

func PongResetBall(state *PongState) {
	state.BallX = state.Width / 2
	state.BallY = state.Height / 2
	state.BallDX = -state.Width / 16 // TODO: random -w/16 or w/16
	state.BallDY = -state.Width / 16 // TODO: random [-w/16, w/16]
}

func PongInit() (state *PongState) {
	state = &PongState{Width: 640, Height: 360, PlayerRadius: 35, PlayerWidth: 25, BallRadius: 15, PlayerSpeed: 10}
	state.PlayerR.Y = state.Height / 2
	state.PlayerL.Y = state.Height / 2
	PongResetBall(state)
	return
}

func PongMovePlayer(state *PongState, player *PongPlayer, moveUp bool) {
	// TODO: Only allow a certain number of moves per time
	if moveUp {
		player.Y -= state.PlayerSpeed
		if player.Y < state.PlayerRadius {
			player.Y = state.PlayerRadius
		}
	} else {
		player.Y += state.PlayerSpeed
		if state.Height - state.PlayerRadius < player.Y {
			player.Y = state.Height - state.PlayerRadius
		}
	}
}

func PongIter(state *PongState) {
	// TODO: Changed this
	if !(0 <= state.BallY && state.BallY < state.Height) {
		// Ball Collided with wall
		state.BallDY *= -1
	}
	if state.BallX < state.PlayerWidth {
		// In PlayerL goal area
		if state.PlayerL.Y - state.PlayerRadius - state.BallRadius < state.BallY && state.BallY < state.PlayerL.Y + state.PlayerRadius + state.BallRadius {
			// Hit Player
			state.BallDX *= -1
		} else {
			PongResetBall(state)
			state.PlayerL.Score++
		}
	} else if state.Width-state.PlayerWidth < state.BallX {
		// In PlayerR goal area
		if state.PlayerR.Y - state.PlayerRadius - state.BallRadius < state.BallY && state.BallY < state.PlayerR.Y + state.PlayerRadius + state.BallRadius {
			// Hit Player
			state.BallDX *= -1
		} else {
			PongResetBall(state)
			state.PlayerR.Score++
		}
	}
	state.BallX += state.BallDX
	state.BallY += state.BallDY
}

func PongRender(state *PongState) (draw [][]interface{}) {
	draw = [][]interface{}{}
	draw = append(draw, []interface{}{"clear", []int{0, 0, 0}})
	draw = append(draw, []interface{}{"circle", []int{state.BallX, state.BallY}, state.BallRadius, []int{0, 0, 255}})
	draw = append(draw, []interface{}{"rectangle", []int{0, state.PlayerL.Y - state.PlayerRadius}, []int{state.PlayerWidth, state.PlayerL.Y + state.PlayerRadius}, []int{255, 0, 0}})
	draw = append(draw, []interface{}{"rectangle", []int{0, state.PlayerR.Y - state.PlayerRadius}, []int{state.PlayerWidth, state.PlayerR.Y + state.PlayerRadius}, []int{0, 255, 0}})
	return draw
}

func main() {
	state := PongInit()
	for x := 0; x < 20; x++ {
		fmt.Println(state)
		//fmt.Println(PongRender(state))
		PongIter(state)
		PongAI(state, &state.PlayerL)
		PongAI(state, &state.PlayerR)
	}
}

func PongAI(state *PongState, player *PongPlayer) {
	PongMovePlayer(state, player, player.Y < state.BallY)
}

/*
def ai_basic(state, player):
    if state['player_' + player] < state['ball'][1]:
        pong_move_player(state, player, state['player_' + player] + 10)
    else:
        pong_move_player(state, player, state['player_' + player] - 10)


def ai_random(state, player):
    pong_move_player(state, player, state['player_' + player] + random.randint(-10, 10))
*/
