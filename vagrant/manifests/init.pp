group { "puppet":
    ensure => "present",
}

file { '/home/vagrant/.pam_environment':
content => "GOPATH=/home/vagrant/gocode\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/vagrant/android-studio/sdk/platform-tools:/home/vagrant/android-studio/sdk/tools",
owner => vagrant,
group => vagrant,
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

class go_packages {
  exec { "go-dependencies":
    command => "/bin/mkdir -p /home/vagrant/gocode && /usr/bin/go get -u code.google.com/p/go.net/websocket code.google.com/p/goauth2/oauth code.google.com/p/google-api-go-client/mirror/v1 github.com/garyburd/redigo/redis github.com/gorilla/pat github.com/gorilla/sessions github.com/ugorji/go/codec",
    environment => ["GOPATH=/home/vagrant/gocode"]
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
    command => "/usr/bin/git clone https://github.com/OpenShades/wearscript.git && /bin/chown -R vagrant:vagrant wearscript",
    cwd => '/home/vagrant'
  }
}

class android_studio {
  exec { "download-android-studio":
    command => "/usr/bin/wget https://dl-ssl.google.com/dl/android/studio/install/0.3.2/android-studio-bundle-132.893413-linux.tgz && /bin/tar -xzf android-studio-bundle-132.893413-linux.tgz && /bin/chown -R vagrant:vagrant android-studio",
    creates => '/home/vagrant/android-studio',
    cwd => '/home/vagrant',
  }
}

stage {[java, install_apt, install_pip, install_go, install_wearscript]:}
Stage[java] -> Stage[install_apt] -> Stage[install_pip] -> Stage[install_go] -> Stage[install_wearscript]
class {java: stage => java}
class {apt_packages: stage => install_apt}
class {pip_packages: stage => install_pip}
class {go_packages: stage => install_go}
class {wearscript: stage => install_wearscript}
class {android_studio: stage => install_wearscript}