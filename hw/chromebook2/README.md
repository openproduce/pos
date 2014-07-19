DRAFT

# Setup for 11.6 inch Samsung Chromebook 2 (model XE503C12, aka "peach pit")

This document explains how to configure a Chromebook 2 as a point of sale
computer.

## Buy the right stuff

You will need
- 11.6 inch 2014 Samsung Chromebook 2
- 8GB microSD card

Do not buy a 2012 Samsung Chromebook by mistake. Also do not buy a 13.3 inch
Samsung Chromebook 2 aka "peach pi" by mistake.

## Make sure it basically works

Before voiding the warranty, check that the computer basically works.

1. Boot the computer and make sure it does not start on fire.
2. Accept the shrinkwrap license, sign in as a guest and derp around a bit.
3. If something is obviously broken, get a new computer.

## Void the warranty

We will alas need to void the warranty to circumvent some of this fine
computer's sophisticated secure-i-tay.

### Make the readonly firmware writeable 

Go rummage through the garage to find a small Phillips head screwdriver and
something flat to pry apart plastic with.

1. Unscrew and unsnap the bottom panel. Isn't unsnapping plastic great?
2. Unplug the battery, being careful not to short the pins on its connector.
The connector is held down by some tiny metal clasps and can be lifted gently
away from the socket after they are disengaged. Getting the clasps disengaged
is kind of a bitch; I accidentally broke one off, don't tell anyone.
3. Remove the write protect screw. The screw is mid-way along the back edge of
the motherboard. When it is removed you'll see two halves of a split gold
circular trace it used to bridge.
4. Put everything back together.

### Make sure it still basically works

You didn't break it, did you?

## Enter developer mode

To use our own software we need to enter developer mode.

1. Turn off the laptop.
2. Hold Esc and Refresh and press Power. This will start "recovery mode". Modes
are awesome.
3. Once the recovery screen shows up, press Ctrl+D. (There's no prompt to do
so, it's a secret key combination.)
4. Press enter to confirm. The laptop will reboot and draw an ASCII art
progress bar for 15 minutes. 
5. We'll fix the annoying splash screen and SPACE prompt later. This is good
enough for now.

## Provision the flash card

### Partition the card

Start out on your trusty normal Linux computer.

1. Plug in the flash card, unmount anything automounted and determine its
device name, e.g. `/dev/mmcblk1`. I'll call this `$DEV`.
2. Create a new GPT partition table on the flash card.

        # parted $DEV mktable gpt
        Warning: The existing disk label on $DEV will be destroyed and all
        data on this disk will be lost. Do you want to continue? Yes/No? Yes
        Information: You may need to update /etc/fstab
3. Carve out two 16M ChromeOS kernel partitions (type 7f00) and one big Linux
partition. Here is a gdisk session showing that.

        # gdisk $DEV
        GPT fdisk (gdisk) version 0.8.1
        
        Partition table scan:
        MBR: protective
        BSD: not present
        APM: not present
        GPT: present
        
        Found valid GPT with protective MBR; using GPT.
        
        Command (? for help): x
        
        Expert command (? for help): l
        Enter the sector alignment value (1-65536, default = 2048): 8192
        
        Expert command (? for help): m
        
        Command (? for help): n
        Partition number (1-128, default 1): 1
        First sector (34-15523806, default = 34) or {+-}size{KMGTP}: 
        Information: Moved requested sector from 34 to 8192 in
        order to align on 8192-sector boundaries.
        Use 'l' on the experts' menu to adjust alignment
        Last sector (8192-15523806, default = 15523806) or {+-}size{KMGTP}: +16M
        Current type is 'Linux filesystem'
        Hex code or GUID (L to show codes, Enter = 8300): 7f00
        Changed type of partition to 'ChromeOS kernel'
        
        Command (? for help): n
        Partition number (2-128, default 2): 2
        First sector (34-15523806, default = 40960) or {+-}size{KMGTP}: 
        Last sector (40960-15523806, default = 15523806) or {+-}size{KMGTP}: +16M
        Current type is 'Linux filesystem'
        Hex code or GUID (L to show codes, Enter = 8300): 7f00
        Changed type of partition to 'ChromeOS kernel'
        
        Command (? for help): n
        Partition number (3-128, default 3): 3
        First sector (34-15523806, default = 73728) or {+-}size{KMGTP}: 
        Last sector (73728-15523806, default = 15523806) or {+-}size{KMGTP}: 
        Current type is 'Linux filesystem'
        Hex code or GUID (L to show codes, Enter = 8300): 
        Changed type of partition to 'Linux filesystem'
        
        Command (? for help): w
        
        Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING
        PARTITIONS!!
        
        Do you want to proceed? (Y/N): y
        OK; writing new GUID partition table (GPT).
        The operation has completed successfully.
4. If you have a janktastic flash controller, unplug the flash card and plug it
back in so that your kernel reads the new GPT.
5. Format the filesystem for the third, root partition. For example if your
device is `/dev/mmcblk1`, this would be `/dev/mmcblk1p3`.

        # mkfs.ext4 $DEV<partition 3>

### Install a root filesystem

#### Use one I already made for you

This is the easy way.
TODO: Make a pre-built base image.

#### Build a new one from scratch

This is the hard way. You only need to do this if you're trying to build a new
base image. I did these steps on the Chromebook because I did not have another
ARM machine handy, but you can probably also use qemu and binfmt\_misc on an
x86 computer if you prefer.

1. Mount the root partition and extract an
[Ubuntu core](https://wiki.ubuntu.com/Core) tarball to it. Choose the most
recent [LTS](https://wiki.ubuntu.com/LTS) release.

        # mkdir /tmp/root
        # mount $DEV<partition 3> /tmp/root
        # wget -O - http://cdimage.ubuntu.com/ubuntu-core/releases/14.04/release/ubuntu-core-14.04-core-armhf.tar.gz | tar xzp -C /tmp/root
Ubuntu core is pretty minimal so we need to chroot to do more setup.
2. Install [crouton](https://github.com/dnschneid/crouton).
3. chroot into crouton with `sudo enter-chroot`. This way you'll be starting
from Ubuntu so group ids, etc. will be the same.
4. chroot into the root fs with `sudo chroot /tmp/root`.
5. Outside the chroot, `cat /etc/resolv.conf` to find your nameserver. Then
copy that into an /etc/resolv.conf in the chroot. For example,

        # cat > /etc/resolv.conf
        nameserver 192.168.1.1
        ^D
        #
6. Install a bunch of packages.

        # vi /etc/apt/sources.list  (Uncomment "universe" lines.)
        # apt-get update
        # apt-get install matchbox chromium-browser x11-xserver-utils fonts-liberation xwit sqlite3 libnss3 wireless-tools wpasupplicant

### Install a kernel

Next we need a kernel. You could try to build one. When I tried, I got no
video, so I assume some Samsung patches haven't made it back into mainline yet.
Fortunately the Chromebook already has a working kernel so we can just use
that. So let's move over to the Chromebook.

1. Press Ctrl+Alt+T, `shell`, and `sudo -s`.
2. Repack the kernel into an image with our own command-line.

        # cd /tmp
        # dd if=/dev/mmcblk0p2 of=/tmp/oldblob
        # echo "console=tty1 debug verbose root=/dev/mmcblk1p3 rootwait rw lsm.module_locking=0" > /tmp/config
        # vbutil_kernel --repack /tmp/newkern --keyblock /usr/share/vboot/devkeys/kernel.keyblock --version 1 --signprivate /usr/share/vboot/devkeys/kernel_data_key.vbprivk --config=/tmp/config --oldblob /tmp/oldblob
3. Write out the kernel image to the kernel partitions and mark them bootable.

        # dd if=/tmp/newkern of=/dev/mmcblk1p1
        # dd if=/tmp/newkern of=/dev/mmcblk1p2
        # cgpt add -i 1 -S 1 -T 5 -P 10 -l KERN-A /dev/mmcblk1
        # cgpt add -i 2 -S 1 -T 5 -P 5 -l KERN-B /dev/mmcblk1
4. Mount the root filesystem and copy over modules.

        # mkdir /tmp/root
        # mount /dev/mmcblk1p3 /tmp/root
        # cp -ar /lib/modules /tmp/root/lib
        # cp -ar /lib/firmware /tmp/root/lib
        # umount /tmp/root

## Reconfigure the firmware

By default, developer mode boots with a 30 second splash screen that shows a
message telling you to press SPACE. Pressing SPACE then disables developer
mode. We do not desire this.

The bootloader lives in not-readonly-anymore firmware. It's open source, so in
theory we could rebuild it. However, that would be a pain in the ass. We'd need
to get the code for a rapidly changing open source project, get it building,
patch it, get the patch building, dump vendor binaries that aren't checked into
the open source project, rebuild it, and then flash our untested firmware and
hope we don't brick the computer.

Instead, we'll reconfigure the bootloader to show the boot screen for only 2
seconds and to ignore the spacebar if pressed.

1. Sign in as a guest and press Ctrl+Alt+T to open a terminal.
2. At the prompt type shell then `sudo -s` to become root.
3. `crossystem dev_boot_usb=1 dev_boot_signed_only=0` to enable booting from
USB and allow booting unsigned images, such as the one we'll be installing.
4. `set_gbb_flags.sh 0x09` to make developer mode sticky.

## Useful URLs

https://www.berrange.com/tags/chromebook/
