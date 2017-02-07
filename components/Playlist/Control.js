import React from 'react';

const Control = () => {
  return (
    <div>
      <button>
        <i className="step backward icon"></i>
      </button>
      <button>
        <i class="pause icon"></i>
        <i className="play icon"></i>
      </button>
      <button>
        <i className="step forward icon"></i>
      </button>
      <button>
        <i className="random icon"></i>
      </button>
      <button>
        <i className="repeat icon"></i>
      </button>
    </div>
  );
};

export default Control;