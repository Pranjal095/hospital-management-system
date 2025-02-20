FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y dbus-x11 \
    xvfb \
    dbus \
    x11-utils \
    xauth \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libavahi-client3 \
    libavahi-common3 \
    libblkid1 \
    libbrotli1 \
    libbsd0 \
    libcairo2 \
    libcairo-gobject2 \
    libcap2 \
    libcom-err2 \
    libcups2 \
    libdatrie1 \
    libdbus-1-3 \
    libdrm2 \
    libepoxy0 \
    libexpat1 \
    libffi8 \
    libfontconfig1 \
    libfreetype6 \
    libfribidi0 \
    libgbm1 \
    libgcc-s1 \
    libgcrypt20 \
    libgdk-pixbuf-2.0-0 \
    libgdk3.0-cil \
    libglib2.0-0 \
    libgmp10 \
    libgnutls30 \
    libgpg-error0 \
    libgraphite2-3 \
    libgssapi-krb5-2 \
    libgtk-3-0 \
    libharfbuzz0b \
    libhogweed6 \
    libidn2-0 \
    libjpeg-turbo8 \
    libk5crypto3 \
    libkeyutils1 \
    libkrb5-3 \
    libkrb5support0 \
    liblz4-1 \
    liblzma5 \
    libmd0 \
    libmount1 \
    libnettle8 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libpcre2-8-0 \
    libpcre3 \
    libpixman-1-0 \
    libpng16-16 \
    libc6 \
    libselinux1 \
    libsystemd0 \
    libtasn1-6 \
    libthai0 \
    libunistring2 \
    libuuid1 \
    libwayland-client0 \
    libwayland-cursor0 \
    libwayland-egl1 \
    libwayland-server0 \
    libx11-6 \
    libxau6 \
    libxcb-randr0 \
    libxcb-render0 \
    libxcb-shm0 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxdmcp6 \
    libxext6 \
    libxfixes3 \
    libxinerama1 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    zlib1g \
    libzstd1 \
    ca-certificates fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

    RUN useradd -m appuser

    WORKDIR /home/appuser

    COPY dist/hospital-management-system-1.0.0.AppImage /home/appuser/hms.AppImage
    RUN chmod +x /home/appuser/hms.AppImage && chown appuser:appuser /home/appuser/hms.AppImage

    RUN mkdir -p /run/dbus && dbus-uuidgen > /var/lib/dbus/machine-id

    USER appuser
    WORKDIR /home/appuser

    RUN ./hms.AppImage --appimage-extract

    ENV DISPLAY=:99
    ENV DBUS_SESSION_BUS_ADDRESS="unix:path=/run/dbus/system_bus_socket"

    WORKDIR /home/appuser/squashfs-root

    USER root
    RUN mkdir -p /run/dbus && chmod 1777 /run/dbus
    RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix
    RUN chmod 4755 /home/appuser/squashfs-root/chrome-sandbox || true

    USER appuser

    CMD dbus-daemon --system --fork && \
    Xvfb :99 -screen 0 1024x768x24 & \
    sleep 2 && \
    ./hospital-management-system --no-sandbox --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --disable-features=UseChromeOSDirectVideoDecoder
