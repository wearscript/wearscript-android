group { "puppet":
    ensure => "present",
}

exec { 'setenvironment':
command => "/bin/bash -c 'printf GOPATH=`pwd`/gocode\\\\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:`pwd`/android-studio/sdk/platform-tools:`pwd`/android-studio/sdk/tools' > /etc/environment",
}

class apt_packages {
  exec { "apt-get-update":
    command => "/usr/bin/apt-get update",
  }
      $pkgs = ["golang", "git", "mercurial", "redis-server", "libcv-dev", "python-opencv", "python-pip", "libevent-dev", "python-dev", "oracle-java7-installer", "libc6-i386", "lib32stdc++6", "lib32gcc1", "lib32ncurses5", "lib32z1", "xorg"]
      package {$pkgs: ensure => "installed",
      require => Exec[apt-get-update],
      }
}

class pip_packages {
      service { "redis-server":
        enable => true,
      }
      package {
      "gevent":
          ensure => latest,
          provider => pip;
      "gevent-websocket":
          ensure => latest,
          require => Package["gevent"],
          provider => pip;
      "redis":
          ensure => latest,
          provider => pip;
      "bottle":
          ensure => latest,
          provider => pip;
      "msgpack-python":
          ensure => latest,
          provider => pip;
      "websocket-client":
          ensure => latest,
          provider => pip;
      }      
}

class java {
  package { "python-software-properties": }
 
  exec { "add-apt-repository-oracle":
    command => "/usr/bin/add-apt-repository -y ppa:webupd8team/java && /usr/bin/apt-get update",
  }
  
  exec {
    'set-licence-selected':
      command => '/bin/echo debconf shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections';
 
    'set-licence-seen':
      command => '/bin/echo debconf shared/accepted-oracle-license-v1-1 seen true | /usr/bin/debconf-set-selections';
  }
}

class wearscript {
  exec { "clone-repo":
    command => "/usr/bin/git clone https://github.com/OpenShades/wearscript.git && chown --reference . -R wearscript",
  }
}

class android_studio {
  exec { "download-android-studio":
    command => "/usr/bin/wget https://dl-ssl.google.com/dl/android/studio/install/0.3.2/android-studio-bundle-132.893413-linux.tgz && /bin/tar -xzf android-studio-bundle-132.893413-linux.tgz && chown --reference . -R android-studio",
    timeout => 3600
  }
}

stage {[java, install_apt, install_pip, install_go, install_wearscript]:}
Stage[java] -> Stage[install_apt] -> Stage[install_pip] -> Stage[install_wearscript]
class {java: stage => java}
class {apt_packages: stage => install_apt}
class {pip_packages: stage => install_pip}
class {wearscript: stage => install_wearscript}
class {android_studio: stage => install_wearscript}