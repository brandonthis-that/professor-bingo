# professor-bingo
A class bingo game for fun and reinforce learning


ON a different note, how to fix arch audio on home machine:


install sof-firmware

create a file in /etc/modprobe.conf/inteldsp.conf and paste the following

options snd_intel_dspcfg dsp_driver=1

