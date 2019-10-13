from time import sleep
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
import urllib2

button1 = 7

GPIO.setup(button1, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while(1):
    #print "here"
    if GPIO.input(button1) == 0:
        response = urllib2.urlopen('')
        html = response.read()
        print "Button 1 was pressed!"
        print html
        sleep(.1)

