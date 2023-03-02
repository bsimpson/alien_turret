function initialize() {
  const roundsCounterEl = document.querySelector('.rounds_counter');
  const timeCounterEl = document.querySelector('.time_counter');
  const tempEl = document.querySelector('.temp_chart .progress');
  const rmEl = document.querySelector('.rm_chart .progress');

  let ammo = 1000;
  let timer = 0;
  let temp = 0;
  let ammoHistory = [];
  let fireInterval;

  window.addEventListener('keydown', (evt) => {
    if (evt.keyCode !== 32) {
      return;
    }

    if (fireInterval) {
      return;
    }

    fireInterval = startFire();
  });

  window.addEventListener('keyup', (evt) => {
    clearInterval(fireInterval)
    fireInterval = null;
  });

  window.addEventListener('touchstart', () => {
    if (fireInterval) {
      return;
    }

    fireInterval = startFire();
  });

  window.addEventListener('touchend', () => {
    clearInterval(fireInterval)
    fireInterval = null;
  });

  function startFire() {
    return setInterval(() => {
      if ((ammo - 2) >= 0 && temp < 100) {
        ammo -= 2;
        ammoHistory.unshift(Date.now());
        ammoHistory.unshift(Date.now());
        timer += 2;
      }

      temp = Math.min(100, temp + 1);

      roundsCounterEl.innerText = ammo;
      timeCounterEl.innerText = (timer / 60).toPrecision(2);
      tempEl.style.bottom = `-${100 - temp}%`;
    }, 10);
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
}

// TODO cool sound effects


window.onload = initialize;
