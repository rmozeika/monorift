adb -R root
adb remount
adb pull /system/etc/hosts ./dev.sh/hosts
echo "0.0.0.0   robertmozeika.com" >> ./dev.sh/hosts
adb push ./dev.sh/hosts /system/etc/hosts

echo "10.0.2.2   robertmozeika.com" >> /etc/hosts
