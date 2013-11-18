import matplotlib.pyplot as mp
import matplotlib.patches
import numpy as np
import time
import matplotlib.mlab as mlab
import numpy.random
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse

def main():
    m = np.array([10, 10])
    c = np.array([[10, 0], [0, 10]])
    plot_multivariate_gaussian(m, c)    
    plot_multivariate_gaussian(m + 20, c)


def plot_point_cov(points, nstd=2, ax=None, **kwargs):
    """
    Plots an `nstd` sigma ellipse based on the mean and covariance of a point
    "cloud" (points, an Nx2 array).

    Parameters
    ----------
        points : An Nx2 array of the data points.
        nstd : The radius of the ellipse in numbers of standard deviations.
            Defaults to 2 standard deviations.
        ax : The axis that the ellipse will be plotted on. Defaults to the 
            current axis.
        Additional keyword arguments are pass on to the ellipse patch.

    Returns
    -------
        A matplotlib ellipse artist
    """
    pos = points.mean(axis=0)
    cov = np.cov(points, rowvar=False)
    return plot_cov_ellipse(cov, pos, nstd, ax, **kwargs)

def plot_cov_ellipse(cov, pos, nstd=2, ax=None, **kwargs):
    """
    Plots an `nstd` sigma error ellipse based on the specified covariance
    matrix (`cov`). Additional keyword arguments are passed on to the 
    ellipse patch artist.

    Parameters
    ----------
        cov : The 2x2 covariance matrix to base the ellipse on
        pos : The location of the center of the ellipse. Expects a 2-element
            sequence of [x0, y0].
        nstd : The radius of the ellipse in numbers of standard deviations.
            Defaults to 2 standard deviations.
        ax : The axis that the ellipse will be plotted on. Defaults to the 
            current axis.
        Additional keyword arguments are pass on to the ellipse patch.

    Returns
    -------
        A matplotlib ellipse artist
    """
    def eigsorted(cov):
        vals, vecs = np.linalg.eigh(cov)
        order = vals.argsort()[::-1]
        return vals[order], vecs[:,order]

    if ax is None:
        ax = plt.gca()

    vals, vecs = eigsorted(cov)
    theta = np.degrees(np.arctan2(*vecs[:,0][::-1]))

    # Width and height are "full" widths, not radius
    width, height = 2 * nstd * np.sqrt(vals)
    ellip = Ellipse(xy=pos, width=width, height=height, angle=theta, **kwargs)

    ax.add_artist(ellip)
    return ellip


def plot_multivariate_gaussian(m, c):
    mp.ion()
    mp.show()
    print('True Mean[%r] Cov[%r]' % (m, c))
    a = np.random.multivariate_normal(m, c, 1000)
    print(a.shape)
    m = np.mean(a, 0)
    c = np.cov(a.T)
    print('Est Mean[%r] Cov[%r]' % (m, c))
    plot_point_cov(a)
    for xy in a:
        mp.scatter(*xy)
        mp.draw()
        time.sleep(.01)

if __name__ == '__main__':
    main()
