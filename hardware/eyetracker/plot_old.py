    f = mp.figure()
    ax = f.add_subplot(111, aspect="equal")

    # Draw gaussian
    #delta = .5
    #x = np.arange(m[0] - c[0, 0] * 3, m[0] + c[0, 0] * 3, delta)
    #y = np.arange(m[1] - c[1, 1] * 3, m[1] + c[1, 1] * 3, delta)
    #X, Y = np.meshgrid(x, y)
    #Z = mlab.bivariate_normal(X, Y, sigmax=c[0, 0], sigmay=c[1, 1], mux=m[0], muy=m[1], sigmaxy=c[0, 1])

    # Draw samples
    #CS = mp.contour(X, Y, Z)
    #mp.clabel(CS, inline=1, fontsize=10)
    #mp.title('Simplest default with labels')
    eig_val, eig_vec = np.linalg.eig(c)
    eig_angle = np.arctan2(eig_vec[1, 0], eig_vec[0, 0])
    print(eig_val)
    print(eig_vec)
    print(eig_angle)
    e = matplotlib.patches.Ellipse(m, width=4 * np.sqrt(eig_val.flat[0]), height=4 * np.sqrt(eig_val.flat[1]), angle=eig_angle * 180 / np.pi)
    ax.add_artist(e)
    e.set_alpha(.25)
    e.set_facecolor([0, 1, 0])

