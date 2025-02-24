FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV DISPLAY=:99
ENV DBUS_SESSION_BUS_ADDRESS="unix:path=/run/dbus/system_bus_socket"
ENV XDG_RUNTIME_DIR=/tmp/runtime-appuser

# Install dbus (needed for dbus-uuidgen) first
RUN apt-get update && apt-get install -y dbus && rm -rf /var/lib/apt/lists/*

# Create required users and directories
RUN mkdir -p /var/lib/dbus /run/dbus /tmp/.X11-unix && \
    id -u messagebus &>/dev/null || useradd -r -g messagebus messagebus && \
    useradd -m appuser && \
    chown messagebus:messagebus /run/dbus && \
    chmod 755 /run/dbus && \
    chmod 1777 /tmp/.X11-unix && \
    dbus-uuidgen > /var/lib/dbus/machine-id

# Install required packages
RUN apt update && apt install -y dbus-x11 \
    xvfb \
    dbus \
    x11-utils \
    xauth \
    libcanberra-gtk-module \
    libcanberra-gtk3-module \
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

# Copy and extract AppImage with proper permissions
COPY --chown=appuser:appuser dist/hospital-management-system-1.0.0.AppImage /home/appuser/
USER appuser
RUN cd /home/appuser && \
    chmod +x hospital-management-system-1.0.0.AppImage && \
    ./hospital-management-system-1.0.0.AppImage --appimage-extract && \
    mv squashfs-root app && \
    chmod -R +x app && \
    rm hospital-management-system-1.0.0.AppImage

USER root
RUN chown -R appuser:appuser /home/appuser && \
    chmod -R 755 /home/appuser/app

# Create startup script (fixed)
RUN cat > /home/appuser/start.sh <<'EOF'
#!/bin/bash

# Create /run/dbus (in tmpfs mounted at runtime) with correct permissions
mkdir -p /run/dbus
chown messagebus:messagebus /run/dbus
chmod 755 /run/dbus
rm -f /run/dbus/system_bus_socket

# Start the D-Bus daemon
dbus-daemon --system --fork --address=unix:path=/run/dbus/system_bus_socket
sleep 2

# Verify that the host X server is available
if ! xdpyinfo -display "$DISPLAY" > /dev/null 2>&1; then
    echo "Error: Unable to connect to the host X server at $DISPLAY"
    exit 1
fi

# Now switch to appuser to run the application
su appuser -c "cd /home/appuser/app && exec ./hospital-management-system --enable-logging --no-sandbox --disable-gpu --disable-dev-shm-usage"
EOF

RUN chmod +x /home/appuser/start.sh && \
    chown appuser:appuser /home/appuser/start.sh

# Run the container as root so the startup script can create /run/dbus
WORKDIR /home/appuser/app
CMD ["/home/appuser/start.sh"]
