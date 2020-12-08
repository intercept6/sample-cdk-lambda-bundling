import json


def get_fizzbuzz(upper_limit):
    fizzbuzz = []

    for i in range(1, upper_limit + 1):
        if i % 15 == 0:
            fizzbuzz.append('fizzbuzz')
        elif i % 5 == 0:
            fizzbuzz.append('buzz')
        elif i % 3 == 0:
            fizzbuzz.append('fizz')
        else:
            fizzbuzz.append(str(i))

    return fizzbuzz


def handler(event):
    return json.dumps(get_fizzbuzz(event['upper_limit']))

