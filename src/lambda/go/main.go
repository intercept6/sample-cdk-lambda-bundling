package main

import (
	"context"
	"strconv"

	"github.com/aws/aws-lambda-go/lambda"
)

type Event struct {
	Limit int `json:"limit"`
}

func getFizzbuzz(limit int) []string {
	fizzbuzz := make([]string, 0, limit)

	for i := 1; i <= limit; i++ {
		switch {
		case i%15 == 0:
			fizzbuzz = append(fizzbuzz, "fizzbuzz")
		case i%5 == 0:
			fizzbuzz = append(fizzbuzz, "buzz")
		case i%3 == 0:
			fizzbuzz = append(fizzbuzz, "fizz")
		default:
			fizzbuzz = append(fizzbuzz, strconv.Itoa(i))
		}
	}

	return fizzbuzz
}

func HandleRequest(_ context.Context, event Event) ([]string, error) {
	return getFizzbuzz(event.Limit), nil
}

func main() {
	lambda.Start(HandleRequest)
}
