function initialize() {
  const roundsCounterEl = document.querySelector('.rounds_counter');
  const timeCounterEl = document.querySelector('.time_counter');
  const tempEl = document.querySelector('.temp_chart .progress');
  const rmEl = document.querySelector('.rm_chart .progress');
  const warningEl = document.querySelector('.warning');

  let ammo = 1000;
  let timer = 0;
  let temp = 0;
  let ammoHistory = [];
  let fireInterval;
  // https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=85337
  let sound = new Audio('turret-fire.mp3');
  sound.play();
  sound.pause();

  window.addEventListener('keydown', (evt) => {
    if (evt.keyCode !== 32) {
      return;
    }

    startFire();
  });
  window.addEventListener('keyup', stopFire);

  window.addEventListener('touchstart', startFire);
  window.addEventListener('touchend', stopFire);

  function startFire() {
    if (fireInterval) {
      return;
    }

    fireInterval = setInterval(() => {

      if ((ammo - 1) >= 0 && temp < 100) {
        sound.play();
        ammo -= 1;
        ammoHistory.unshift(Date.now());
        ammoHistory.unshift(Date.now());
        timer += 1;
      }

      temp = Math.min(100, temp + .25);

      roundsCounterEl.innerText = ammo;
      timeCounterEl.innerText = (timer / 60).toPrecision(2);
      tempEl.style.bottom = `-${100 - temp}%`;
    }, 10);
  }

  function stopFire() {
    clearInterval(fireInterval)
    fireInterval = null;
    sound.load();
  }

  // handle cooldown
  setInterval(() => {
    temp = Math.max(0, temp - 10);
    tempEl.style.bottom = `-${100 - temp}%`;
  }, 1000);

  // color warnings
  setInterval(() => {
    if (temp > 90) {
      tempEl.classList.add('danger')
      tempEl.classList.remove('caution')
    } else if (temp > 70) {
      tempEl.classList.remove('danger')
      tempEl.classList.add('caution')
    } else {
      tempEl.classList.remove('danger')
      tempEl.classList.remove('caution')
    }

    if (ammo < 100) {
      roundsCounterEl.classList.add('danger');
      roundsCounterEl.classList.remove('caution');
    } else if (ammo < 200) {
      roundsCounterEl.classList.remove('danger');
      roundsCounterEl.classList.add('caution');
    } else {
      roundsCounterEl.classList.remove('danger');
      roundsCounterEl.classList.remove('caution');
    }
  }, 100);

  // rounds / minute
  setInterval(() => {
    const rm = ammoHistory.filter(ammo => (ammo > Date.now() - 60000)).length;
    rmEl.style.bottom = `-${100 - (rm / 10)}%`;
  }, 1000);

  // critical overlay
  setInterval(() => {
    if (ammo < 50) {
      console.log('here')
      warningEl.classList.remove('hidden');
      if (warningEl.classList.contains('flash')) {
        warningEl.classList.remove('flash');
      } else {
        warningEl.classList.add('flash');
      }
    }
  }, 500);
}

// TODO cool sound effects


window.onload = initialize;
