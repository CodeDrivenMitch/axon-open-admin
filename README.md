# Axon Open Admin

Axon Framework is a great CQRS/Event-Sourcing library. However, it comes with little to no built-in support for managing your tracking tokens or event store. 
This project aims to fix that problems and provides an administration interface without requiring additional deployments. Just add the Spring Boot starter and it works out of the box.

# NOTICE
The repository has been moved to the [codecentric GitHub](https://github.com/codecentricnl/axon-open-admin). Axon Admin will be improved further there! 

![](teaser.png)


Note that this is a project currently in its initial development. Except a lot of changes, new versions and added features. Do you want to contribute? Always great! Look in the issues for all the things on the roadmap. 

## How to install

The repository has been moved to the [codecentric GitHub](https://github.com/codecentricnl/axon-open-admin). Axon Admin will be improved further there!

Add the following dependency to your maven project:

```
<dependency>
    <groupId>nl.codecentric.axon-open-admin</groupId>
    <artifactId>axon-open-admin-starter</artifactId>
    <version>0.0.8</version>
</dependency>
```

When your application now boots you can access the administration interface at `/(your-context-path)/axon-admin/`. Enjoy!
